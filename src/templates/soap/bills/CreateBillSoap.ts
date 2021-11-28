import {BaseSoapTemplate} from "../BaseSoapTemplate";
import {Bill} from "../../../models/Bill";
import {EBillType} from "../../../common/enum/eBill";
import moment = require("moment");
import {BillCreditMemo} from "../../../models/BillCreditMemo";
import {urlencoded} from "express";
const toXML = require("to-xml").toXML;

export class CreateBillSoap extends BaseSoapTemplate {

    private bill;

    private type : EBillType;

    private note: BillCreditMemo;

    constructor(bill: Bill, type, note) {
        super();
        this.bill = bill;
        this.type = type;
        this.note = note;
    }

    getData() {

        const bill : Bill = this.bill;

        const order = bill.order;

        const customer = bill.order.customer;

        if(!customer.email){
            customer['email'] = 'facturacionlucymodas@gmail.com';
        }

        const orderDelivery = bill.order.orderDelivery;

        const billConfig = bill.billConfig;

        const CustomerState = customer.state;
        const CustomerMunicipality = customer.municipality;

        const departamento = {
            'codigo' : '05',
            'nombre' : 'ANTIOQUIA'
        };
        const ciudad = {
            'codigo' : '05380',
            'nombre' : 'LA ESTRELLA'
        };
        const pais = {
            'nombre' : 'Colombia',
            'codigo' : 'CO'
        };
        const moneda = 'COP';
        const empresa = {
            'nombre' : 'LUCY MODAS COLOMBIA',
            'nombre_completo' : 'LUCY MODAS COLOMBIA SAS',
            'nit' : '901092426',
            'direccion' : 'CL. 73 SUR #63 AA - 185',
            'telefono' : '(4) 6103863',
            'email' : 'facturacionlucymodas@gmail.com',
            'responsabilidad_fiscal' : 'ZZ',
            'tipo_regimen' : '05',
            'tipo_operacion' : '10',
            'tipo_empresa' : 1,
            'tipo_id' : 31
        };


        /** Calculo de Facturación */

        let monto_venta = 0;
        let monto_venta_sin_iva = 0;
        let restante = 0;

        let total = 0;
        let subtotal = 0;
        let impuestos = 0;

        let InvcDtl = [];
        let InvcTax = [];

        const iva = 1.19;

        /** Calculo de productos para facturación */
        order.orderDetails.forEach((producto, index) => {

            producto['valor_unitario'] = 0;
            producto['valor_total'] = 0;

            producto['precio_venta'] = producto.price / 100 * (100 - producto.discountPercent);

            monto_venta += (producto.price / 100 * (100 - producto.discountPercent)) * producto.quantity;
            monto_venta_sin_iva = monto_venta / iva;
            restante = monto_venta_sin_iva - subtotal;

            if(index === (order.orderDetails.length - 1)){
                producto['precio_venta'] = restante * 1.19 / producto.quantity;
            }

            // al 100 se le sumaba el iva pero en todos es 0.. / (100 + factura['iva'], 2)
            producto['valor_unitario'] = Math.round(producto['precio_venta'] * 100) / 100;
            producto['valor_total'] = producto.quantity * parseFloat(producto['valor_unitario']);
            producto['valor_iva'] = (producto['valor_total'] * 0 / 100,2).toFixed(2);
            subtotal += producto['valor_total'];
            impuestos += producto['valor_iva'];

            InvcDtl.push({
                'Company' : empresa['nit'],
                'InvoiceNum' : bill.id,
                'InvoiceLine' : (index + 1),
                'PartNum' : producto['id'],
                'LineDesc' : producto['id'] + ' - ' + producto.size + ' - ' + producto.color,
                'PartNumPartDescription' : producto.id + ' - ' + producto.size + ' - ' + producto.color,
                'SellingShipQty' : producto.quantity,
                'SalesUM' : 94,
                'UnitPrice' : parseFloat(producto['valor_unitario']),
                'DocUnitPrice' : parseFloat(producto['valor_unitario']),
                'DocExtPrice' : parseFloat(producto['valor_total']),
                'DspDocExtPrice' : parseFloat(producto['valor_total']),
                'DiscountPercent' : 0,
                'Discount' : 0,
                'DocDiscount' : 0,
                'DspDocLessDiscount' : 0,
                'DspDocTotalMiscChrg' : 0,
                'CurrencyCode' : moneda
            });

            InvcTax.push({
                    'Company' : empresa['nit'],
                    'InvoiceNum' : billConfig.prefix + bill.legalNumber,
                    'InvoiceLine' : (index + 1),
                    'CurrencyCode' : moneda,
                    'RateCode' : 'IVA 19',
                    'DocTaxableAmt' : parseFloat(producto['valor_total']),
                    'TaxAmt' : producto['valor_iva'],
                    'DocTaxAmt' : producto['valor_iva'],
                    'Percent' : bill.tax,
                    'WithholdingTax_c' : false
            });

        });

        //total
        subtotal = subtotal ? parseFloat(subtotal.toString()) : 0;
        impuestos = impuestos ? parseFloat(impuestos.toString()) : 0;
        orderDelivery.deliveryCost = orderDelivery.deliveryCost ? parseFloat(orderDelivery.deliveryCost.toString()) : 0;

        total = subtotal + impuestos + orderDelivery.deliveryCost;

        const InvcHead = {
            'Company' : empresa['nit'],
            'InvoiceType' : 'InvoiceType',
            'InvoiceNum' : bill.id,
            'LegalNumber' : billConfig.prefix + bill.legalNumber,
            'InvoiceRef' : '',
            'CustNum' : customer.document,
            'ContactName' : customer.name,
            'CustomerName' : customer.name,
            'InvoiceDate' :  moment(bill.createdAt).format('MM/DD/YYYY HH:mm:ss'),
            'DueDate' : moment(bill.createdAt).format('MM/DD/YYYY HH:mm:ss'),
            'DspDocSubTotal' : subtotal,
            'DocTaxAmt' : impuestos,
            'DocWHTaxAmt' : '0',
            'DspDocInvoiceAmt' : total,
            'InvoiceComment' : '',
            'CurrencyCodeCurrencyID' : moneda,
            'CurrencyCode' : moneda,
            'NumResol' : billConfig.number,
            'OrderNum' : bill.id,
            'Resolution1' : 'Numeración de facturación electrónica según resolución DIAN No. ' + billConfig.number + ' del ' + billConfig.resolutionDate + ' de ' + billConfig.prefix + billConfig.startNumber + ' a ' + billConfig.prefix + billConfig.finalNumber,
            'Discount' : 0,
            'PaymentMeansID_c' : 1,
            'PaymentMeansDescription' : 'Contado',
            'PaymentMeansCode_c' : 10,
            'PaymentDurationMeasure' : 0,
            'PaymentDueDate' : moment(bill.createdAt).format('YYYY-MM-DD'),
            'DspValueDebt': "", //CHECK
            'CalculationRate_c': "", //CHECK
            'DateCalculationRate_c': "" //CHECK
        };

        const Customer = {
            'Company': empresa['nit'],
            'CustID': customer.document,
            'CustNum': customer.document,
            'ResaleID': customer.document,
            'Name': customer.name,
            'Address1': customer.address || "test address",
            'EMailAddress': customer.email,
            'PhoneNum':customer.phone,
            'CurrencyCode': moneda,
            'Country': pais['nombre'],
            'RegimeType_c': empresa['tipo_regimen'],
            'FiscalResposability_c': empresa['responsabilidad_fiscal'],
            'IdentificationType': 13,
            'State': CustomerState.name,
            'StateNum': CustomerState.dianCode,
            'City': CustomerMunicipality.name,
            'CityNum': CustomerMunicipality.dianCode
        };

        const Company = {
            'Company' : empresa['nit'],
            'StateTaxID' : empresa['nit'],
            'Name' : empresa['nombre_completo'],
            'FiscalResposability_c' : empresa['responsabilidad_fiscal'],
            'OperationType_c' : empresa['tipo_operacion'],
            'CompanyType_c' : empresa['tipo_empresa'],
            'RegimeType_c' : empresa['tipo_regimen'],
            'State' : departamento['nombre'],
            'StateNum' : departamento['codigo'],
            'City' : ciudad['nombre'],
            'CityNum' : ciudad['codigo'],
            'IdentificationType' : empresa['tipo_id'],
            'Address1' : empresa['direccion'],
            'Country' : pais['nombre'],
            'PhoneNum' : empresa['telefono'],
            'Email' : empresa['email'],
            'FaxNum': ''
    };
        const COOneTime = {
            'Company' : empresa['nit'],
            'IdentificationType' : 13,
            'COOneTimeID' : customer.document,
            'Name' : customer.name,
            'CountryCode' : pais['codigo'],
            'CompanyName': empresa['nombre']
    };
        const SalesTRC = {
            'Company' : empresa['nit'],
            'RateCode' : 'IVA 19',
            'TaxCode' : 'IVA',
            'Description' : 'IVA 19',
            'IdImpDIAN_c' : '01'
    };
        //flete
        const InvcMisc = {
            'Company' : empresa['nit'],
            'InvoiceNum' : bill.id,
            'InvoiceLine' : 0,
            'MiscCode' : 'Flete',
            'Description' : 'Flete',
            'MiscAmt' : orderDelivery.deliveryCost,
            'DocMiscAmt' : orderDelivery.deliveryCost,
            'MiscCodeDescription' : 'Flete',
            'Percentage' : 0,
            'MiscBaseAmt' : 0
    };
        /** Agregar ns1:InvoiceType para tods .. */
        /** Nota de credito o nota de debito */
        if(([EBillType.CREDIT,EBillType.DEBIT].includes(this.type)) && this.note){
            if(this.type == EBillType.CREDIT){
                InvcHead['InvoiceType'] = EBillType.CREDIT;
                InvcHead['CMReasonCode_c'] = 2;
                InvcHead['CMReasonDesc_c'] = 'Anulación de factura electrónica';
                Company['OperationType_c'] = '20';
            }else if(this.type == EBillType.DEBIT){
                InvcHead['InvoiceType'] = EBillType.DEBIT;
                InvcHead['DMReasonCode_c'] = 4;
                InvcHead['DMReasonDesc_c'] = 'Otros';
                Company['OperationType_c'] = '30';

                //clean values
                InvcDtl = undefined;
                InvcTax = undefined;
            }
            InvcHead['InvoiceRef'] = InvcHead['LegalNumber'];
            InvcHead['LegalNumber'] = this.note.id.toString();
        }



        const data = {
            "?": "xml version=\"1.0\" encoding=\"utf-8\"",
            'ARInvoiceDataSet' : {
            'InvcHead' : InvcHead,
            'InvcDtl' : InvcDtl,
            'InvcTax' : InvcTax,
            'InvcMisc' : InvcMisc,
            'SalesTRC' : SalesTRC,
            'Customer' : Customer,
            'Company' : Company,
            'COOneTime' : COOneTime
            }
        };

        //remove all unuset values
        ['InvcDtl', 'InvcTax'].forEach(item => {
            if(!data[item]){
                delete data[item];
            }
        });

        //format result for invoice
        const result = {
            prmInvoiceType: this.type,
            prmXmlARInvoice: toXML(data, null, false)
        };

        return result;
    }
}
